import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  console.log('JWT Token:', token); // ✅ LOG THIS
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('➡️ Sending with token:', authReq.headers.get('Authorization')); // ✅ Check this
    return next(authReq);
  }
  return next(req);
};
