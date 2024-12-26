
'use client'

import { useEffect } from "react";

export default function TokenHandler() {
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');

    if (token) {
      localStorage.setItem('token', token);
    }
  }, []);

  return null; 
}
