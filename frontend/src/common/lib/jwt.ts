const JWTManager = () => {
    let inMemoryToken: string | null = null
  
    const getToken = () => inMemoryToken;
  
    const setToken = (accessToken: string) => {
      inMemoryToken = accessToken
    };
  
    const deleteToken = () => {
      inMemoryToken = null
    };
  
    return {
      getToken,
      setToken,
      deleteToken,
    };
  };
  
export default JWTManager();
  