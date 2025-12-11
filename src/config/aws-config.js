// AWS Cognito configuration for Amplify v6
const region = import.meta.env.VITE_AWS_REGION;
const userPoolId = import.meta.env.VITE_AWS_USER_POOL_ID;
const userPoolClientId = import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID;

if (!region || !userPoolId || !userPoolClientId) {
  console.error(
    "Missing required AWS Cognito configuration in environment variables."
  );
}

// const currentUrl = window.location.origin;

export const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: userPoolId,
      userPoolClientId: userPoolClientId,
      loginWith: {
        oauth: {
          domain: 'ap-southeast-1xhsluhfqv.auth.ap-southeast-1.amazoncognito.com', // Domain
          scopes: ['email', 'profile', 'openid'],
          
          redirectSignIn: ['http://localhost:5173'], 
          redirectSignOut: ['http://localhost:5173'],

          responseType: 'code',
          providers: ['Google']
        }
      }
    }
  }
};
