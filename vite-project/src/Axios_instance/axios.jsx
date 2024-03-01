import axios from 'axios';
import {useNavigate} from 'react-router-dom'


const  useApi =  () =>{
        const navigate = useNavigate();
        const api = axios.create({
            // baseURL: 'https://edunestonline.site',
            baseURL: ' http://localhost:8000',
           
            
        });

        api.interceptors.response.use(
            response => response,
            async error => {
                const originalRequest = error.config;
                const accessToken = localStorage.getItem('access_token');

                if (!accessToken) {
                    console.log('No access token found. Redirecting to login...');
                    
                    // navigate('/login'); // adjust this path based on your routing setup
                    return Promise.reject(error);
                }
                // Check if the request is for the refresh token endpoint
                if (originalRequest.url === '/token/refresh/') {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    return Promise.reject(error);
                }

                // Check if the error was 401 Unauthorized
                if (error.response.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    console.log('interceptor calling ');
                    
                    const refreshToken = localStorage.getItem('refresh_token');

                    try {
                        const { data } = await api.post('/token/refresh/', {
                            refresh: refreshToken
                        });

                        // Update the tokens and headers
                        localStorage.setItem('access_token', data.access);
                        localStorage.setItem('refresh_token', data.refresh);
                        console.log('comming acessss tocken ' , data.access )
                        console.log('comming refresh tocken ' , data.refresh )
                        api.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
                        originalRequest.headers['Authorization'] = `Bearer ${data.access}`;
                        console.log(localStorage.getItem('access_token'));
                        console.log('fromm local storage',localStorage.getItem('refresh_token'));

                        
                        return api(originalRequest);
                    } catch (refreshError) {
                        
                        console.error("Error refreshing token:", refreshError);
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        
                    }
                }

                return Promise.reject(error);
            }
        );
  return  api;
        }
export default useApi;