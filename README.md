# **Console Access Library - Quick Start Guide**
## Steps to install Console Access library and get started with demo-console application.

1. Open terminal and go to the `lib/js-client` path and run the following command
    ```
    > tsc
    > tsc -b
    > npm pack
    ```
2. Open terminal and go to the `src` path and run the following command
    ```
    > npm install
    > tsc -b
    > npm pack
    ```
3. Open terminal and go to the `samples/demo-console` path and run the following command
    ```
    > npm install
    ```

4. Set Configuration Parameter to start Console Access Library Sample Application

aitrios-sdk-typescript-dev\samples\demo-console\src\controller\config.ts
----
DemoConfiguration= {
    deviceId : '__deviceId__',
    subDirectoryName : "__subDirectoryName__",
    numberOfImages: numberOfImages,
    skip: skip,
    numberOfInferenceresults: numberOfInferenceresults,
    filter: "__filter__",
    raw: raw,
    time: "__time__",
    getImagesOrderBy: "__getImagesOrderBy__"
}

ConsoleAccessSettings= {
    baseUrl: "__baseUrl__",
    tokenUrl: "__tokenUrl__",
    clientSecret: "__clientSecret__",
    clientId: "__clientId__"
}
----
5. Starting the App

    To run the CLI demo, open cmd terminal from the root folder, go to the `samples/demo-console` and run the following command.
    ```
    > npx ts-node index.ts 
    ```
## Restrictions
- None

## Get a support
- [Contact us](https://developer.aitrios.sony-semicon.com/contact-us/)

## Trademark
- [Read This First](https://developer.aitrios.sony-semicon.com/development-guides/documents/manuals/)
