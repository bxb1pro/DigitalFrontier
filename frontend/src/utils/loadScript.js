// src/utils/loadScript.js
const loadScript = (src, position, id) => {
    if (!document.getElementById(id)) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = src;
      script.id = id;
      script.async = true;
      document[position].appendChild(script);
    }
  };
  
  export default loadScript;