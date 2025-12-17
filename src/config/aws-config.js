// AWS Cognito configuration for Amplify v6
const region = import.meta.env.VITE_AWS_REGION;
const userPoolId = import.meta.env.VITE_AWS_USER_POOL_ID;
const userPoolClientId = import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID;

if (!region || !userPoolId || !userPoolClientId) {
  console.error(
    "Missing required AWS Cognito configuration in environment variables."
  );
}

// Determine redirect URLs based on environment
const getRedirectUrl = () => {
  if (typeof window !== "undefined") {
    // SỬA Ở ĐÂY: Bỏ dấu / đi
    return window.location.origin;
  }
  // Fallback for SSR or build time (cũng nên bỏ / cho đồng bộ nếu config local không có /)
  return "http://localhost:5173";
};

export const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: userPoolId,
      userPoolClientId: userPoolClientId,
      loginWith: {
        oauth: {
          domain:
            "ap-southeast-1xhsluhfqv.auth.ap-southeast-1.amazoncognito.com",
          scopes: ["email", "profile", "openid"],

          // Amplify v6 yêu cầu mảng (Array)
          redirectSignIn: [getRedirectUrl()],
          redirectSignOut: [getRedirectUrl()],

          responseType: "code",
          providers: ["Google"],
        },
      },
    },
  },
};
