module.exports = {
    isValid,
  };
  
  function isValid(user) {
    //   console.log(user)
    return Boolean(user.username && user.password && typeof user.password === "string");
  }
  