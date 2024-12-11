
import { client } from "./client";

// export const uploadImageToSanity = async (imageFile) => {
//   try {
//     const imageAsset = await client.assets.upload('image', imageFile, {
//       contentType: imageFile.type,
//       filename: imageFile.name,
//     });
//     return imageAsset.url; // Return the image URL
//   } catch (error) {
//     console.error("Image upload error:", error);
//     throw new Error("Image upload failed");
//   }
// };



export const uploadImageToSanity = async (imageFile) => {
  try {
    const imageAsset = await client.assets.upload('image', imageFile, {
      contentType: imageFile.type,
      filename: imageFile.name,
    });
    return imageAsset._id; // Return the image asset ID
  } catch (error) {
    console.error("Image upload error:", error);
    throw new Error("Image upload failed");
  }
};
