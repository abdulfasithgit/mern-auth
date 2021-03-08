import cookie from 'js-cookie'

//set the cookie
export const setCookie = (key, value) => {
  if (window !== undefined) {
    cookie.set(key, value, {
      expires: 1
    })
  }
}
//remove the cookie
export const removeCookie = key => {
  if (window !== undefined) {
    cookie.remove(key, {
      expires: 1
    })
  }
}
//get the cookie
export const geteCookie = key => {
  if (window !== undefined) {
    return cookie.get(key)
  }
}
//set localstorage
export const setLocalStorage = (key, value) => {
  if (window !== undefined) {
    localStorage.setItem(key, JSON.stringify(value))
  }
}
//remove localstorage
export const removeLocalStorage = key => {
  if (window !== undefined) {
    localStorage.removeItem(key)
  }
}
//authenticate

export const authenticate = (response, next) => {
    console.log('AUTHENICATE HELPER ON SIGNIN RESPONSE', response);
    setCookie('token', response.data.token);
    setLocalStorage('user', response.data.user);
    next();
}
//
export const isAuth = () =>{
    if (window !== undefined) {
        const cookieChecked = geteCookie('token');
        if (cookieChecked) {
            if (localStorage.getItem('user')) {
              //console.log(JSON.parse(localStorage.getItem('user')) );
                return JSON.parse(localStorage.getItem('user'))
            }else{
                return false;
            }
        }
    }
}

export const signout = next =>{
  removeCookie('token');
  removeLocalStorage('user');
  next();
}

export const updateUser = (response,next) => {
  console.log("update user in local storage response", response);
    if(typeof window !== undefined){
    let auth = JSON.parse(localStorage.getItem('user'));
    auth = response.data;
    localStorage.setItem('user', JSON.stringify(auth));
  }
  next();
}