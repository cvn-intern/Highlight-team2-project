

const JWTManager = () => {
    let inMemoryToken: string | null = null
  
    const getToken = () => {
      if(window.sessionStorage.getItem('accessToken') && inMemoryToken === null){
        inMemoryToken = window.sessionStorage.getItem('accessToken')
      }
      return inMemoryToken 
    };
  
    const setToken = (accessToken: string) => {
      inMemoryToken = accessToken
      window.sessionStorage.setItem('accessToken',accessToken)
    };
  
    const deleteToken = () => {
      inMemoryToken = null
      window.sessionStorage.removeItem('accessToken')
    };
  
    return {
      getToken,
      setToken,
      deleteToken,
    };
  };
  
export default JWTManager();
  