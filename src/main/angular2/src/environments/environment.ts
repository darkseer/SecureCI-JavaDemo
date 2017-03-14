// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  lambdaurl: 'https://4jhbs3q7mf.execute-api.us-east-1.amazonaws.com/Dev',
  region: 'us-east-1',
  identityPoolId: 'us-east-1:0ad49232-e0db-4717-bf08-3e2ca35507c1',
  userPoolId: 'us-east-1_qQDx6p5SR',
  clientId: '584a9pau7pmmie35d3t9mv1c4s',
  envName: 'DEV'
};
