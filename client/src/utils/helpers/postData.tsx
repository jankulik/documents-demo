import { showNotification } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';

export async function postData(data: any, route = '/', isJson = true, baseUrl = 'http://localhost:4000',) {
  try {
    const url = baseUrl + route;
    const response = await fetch(url, {
      method: 'POST',
      body: isJson ? JSON.stringify(data) : data,
      headers: isJson ? { 'Content-Type': 'application/json' } : {},
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }

    if (response.ok) {
      if (isJson)
        return response.json();
      
      return response.text();
    }
  } catch (error) {
    console.error(error);
    showNotification({
      autoClose: 10000,
      title: "Something went wrong",
      message: null,
      color: 'red',
      icon: <IconX />
    });

    throw error;
  }
}
