import { client } from "@/utils/sanity/client";

const getMostOrderedDishQuery = `
*[_type == "order"] {
  products[]->{
    _id,
    name
  }
}
| order(products[]->name asc)
| {
  "dishes": products[]->name,
  "totalOrders": count(products[]->name)
}
| order(count desc)
| {
  "dish": name,
  "orderCount": count
}[0]
`;

const getOrderStatisticsQuery = `
{
  "totalOrders": count(*[_type == "order"]),
  "totalRevenue": sum(*[_type == "order"].total),
  "averageOrderValue": sum(*[_type == "order"].total) / count(*[_type == "order"]),
  "mostFrequentCustomer": *[_type == "order"] {
    "userId": user->_id,
    "userName": user->name
  }
  | group(userId) {
    "name": userName[0],
    "orderCount": count(userId)
  }
  | order(orderCount desc)
  | {
    "user": name,
    "orderCount": orderCount
  }[0]
}
`;

export async function GET() {
  try {
    const mostOrderedDish = await client.fetch(getMostOrderedDishQuery);
    const orderStatistics = await client.fetch(getOrderStatisticsQuery);

    return new Response(JSON.stringify({ mostOrderedDish, orderStatistics }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
