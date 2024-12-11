"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { handleGenericError } from './errorHandler';

const useCrud = (url) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Clear messages
  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
    setResponse(null);
  };
  useEffect(() => {
    clearMessages();
  }, [url]);

  // Generic handler for all requests
  const handleRequest = async (requestFn, requestData = null, successMsg = '') => {
    setLoading(true);
    clearMessages();

    try {
      const res = await requestFn(requestData);
      setResponse(res);
      setSuccessMessage(successMsg);
      mutate(url); // Revalidate the GET request data
      return res.data;
    } catch (e) {
      const err = handleGenericError(e);
      if(err){
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  };
  


  // POST request
  const postData = (postData) => handleRequest(
    (data) => axios.post(url, data),
    postData,
    'Data successfully posted!'
  );

  // // PUT request
  // const putData = (putData) => handleRequest(
  //   (data) => axios.put(url, data),
  //   putData,
  //   'Data successfully updated!'
  // );

  
 // PUT request
 const putData = (userId, itemId) => handleRequest(
  () => axios.put(`${url}/${userId}/${itemId}/`),
  'Data successfully updated!'
);

 const putDataWithUserId = (userId, data) => handleRequest(
  () => axios.put(`${url}/${userId}/`, data),
  'Data successfully updated!'
);
  // DELETE request
  const deleteData = (deleteId) => handleRequest(
    () => axios.delete(`${url}/${deleteId}`),
    null,
    'Data successfully deleted!'
  );
  

  return {
    response,
    error,
    successMessage,
    loading,
    postData,
    putData,
    putDataWithUserId,
    deleteData,
  };
};

export default useCrud;
