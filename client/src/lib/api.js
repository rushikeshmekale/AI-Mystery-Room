async function request(path, options = {}) {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || '/api/v1'}${path}`, {...options, credentials:'include', headers:{'Content-Type':'application/json',...options.headers}});
  const payload = await response.json().catch(()=>({}));
  if (!response.ok) { const error = new Error(payload.error?.message || 'Something went wrong. Please try again.'); error.code=payload.error?.code; error.status=response.status; throw error; }
  return payload.data;
}
export const api = {
  createCase:(body)=>request('/cases',{method:'POST',body:JSON.stringify(body)}),
  getCase:(id)=>request(`/cases/${encodeURIComponent(id)}`),
  updateProgress:(id,body)=>request(`/cases/${encodeURIComponent(id)}/progress`,{method:'PATCH',body:JSON.stringify(body)}),
  accuse:(id,body)=>request(`/cases/${encodeURIComponent(id)}/accusation`,{method:'POST',body:JSON.stringify(body)}),
};
