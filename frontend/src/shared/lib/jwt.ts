

const JWTManager = () => {
    let inMemoryToken: string | null = null
  
    const getToken = () => {
      if(window.localStorage.getItem('accessToken') && inMemoryToken === null){
        inMemoryToken = window.localStorage.getItem('accessToken')
      }
      return inMemoryToken 
    };
  
    const setToken = (accessToken: string) => {
      inMemoryToken = accessToken
      window.localStorage.setItem('accessToken',accessToken)
    };
  
    const deleteToken = () => {
      inMemoryToken = null
      window.localStorage.removeItem('accessToken')
    };
  
    return {
      getToken,
      setToken,
      deleteToken,
    };
  };
  
export default JWTManager();
  