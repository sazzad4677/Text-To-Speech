export function getGoogleCloudCredentials() {
  let credentials = null;

  if (process.env.GOOGLE_CLOUD_CREDENTIALS) {
    credentials = JSON.parse(
      Buffer.from(process.env.GOOGLE_CLOUD_CREDENTIALS, "base64").toString(
        "utf-8"
      )
    );
  }
  return credentials;
}
