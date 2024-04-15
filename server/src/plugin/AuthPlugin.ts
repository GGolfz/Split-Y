import Elysia from "elysia";

const AuthPlugin = new Elysia().derive(({ headers }) => {
    const auth = headers["authorization"];
    return {
      bearer: auth?.startsWith("Bearer ") ? auth.slice(7) : null,
    };
  })

  export default AuthPlugin;