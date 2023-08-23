# **"Console Access Library" - Quick Start Guide**

## Prerequisites
Following required software you need to install in your system

- Node >= v14.16.0

For installation please refer the following link:

https://nodejs.org/en/download/

To node installation
 ```
 node --version
 ```

- TypeScript >= v4.5.2

To install TypeScript global, run the following command
```
npm install -g typescript
```

To verify the TypeScript installation
 ```
 tsc --version
 ```
 
## Install "**Console Access Library**"

- ## Build and generate dependency package for "**Console Access Library**"

 Open terminal and go to the `lib/js-client` path and run the following command

```
    > npm install
    > tsc -b
    > npm pack

```

- ## Build and generate "**Console Access Library**" package

 Open terminal and go to the `src` path and run the following command

```
    > npm install
    > tsc -b
    > npm pack

```

## To Start "**Demo-Console app**"

-  Set up configuration parameter to start "**Demo-Console app**".

* Create console access setting configuration parameters with real values

    `samples/demo-console/console_access_settings.yaml`.

    ```
            console_access_settings:
                console_endpoint: "__console_endpoint__"
                portal_authorization_endpoint: "__portal_authorization_endpoint__"
                client_secret: "__client_secret__"
                client_id: "__client_id__"
    ```

* Network proxy setting

    To use the "**Console Access Library**" in a proxy environment, set the https_proxy environment variable.
    ```
     export https_proxy= http://username:password@proxyhost:port
     
    ```

* Edit demo configuration parameters with real values.
    `samples/demo-console/demo_config.yaml`.
    ```
    demo_configuration:
        device_id: "__device_id__"
        number_of_images: __number_of_images__
        skip: __skip__
        sub_directory_name: "__sub_directory_name__"
        number_of_inference_results: __number_of_inference_results__
        filter: "__filter__"
        raw: __raw__
        time: "__time__"
        converted: "__converted__"
        vendor_name: "__vendor_name__"
        get_images_order_by: "__get_images_order_by__"
        get_last_inference_and_image_data_order_by: "__get_last_inference_and_image_data_order_by__"
        key: "__key__"
        app_name: "__app_name__"
        version_number: "__version_number__"
        model: "__model__"
        model_id: "__model_id__"
        file_content: "__file_content__"
        compiled_flg: "__compiled_flg__"
        file_name: "__file_name__"
        comment: "__comment__"
        input_format_param: "__input_format_param__"
        network_config: "__network_config__"
        network_type: "__network_type__"
        labels: "__labels__"
        config_id: "__config_id__"
        sensor_loader_version_number: "__sensor_loader_version_number__"
        sensor_version_number: "__sensor_version_number__"
        model_version_number: "__model_version_number__"
        ap_fw_version_number: "__ap_fw_version_number__"
        device_ids: "__device_ids__"
        deploy_parameter: "__deploy_parameter__"
        replace_model_id: "__replace_model_id__"
        deploy_id: "__deploy_id__"
        timeout: __timeout__
        from_datetime: "__from_datetime__"
        to_datetime: "__to_datetime__"
        file_format: "__file_format__"
        entry_point: "__entry_point__"
        get_model_id: "__model_id__"
        device_id_for_get_model: "__device_id__"
  
    ```

-  Run the Sample App

    To run the CLI demo, open cmd terminal from the root folder, go to the `samples/demo-console` and run the following command.
   
    ```
    > npm install
    > npx ts-node index.ts 

    ```
    
## Restrictions
- None

## Get support
- [Contact us](https://developer.aitrios.sony-semicon.com/en/contact-us-en)

## See also
- ["**Developer Site**"](https://developer.aitrios.sony-semicon.com/en)

## Trademark
- ["**Read This First**"](https://developer.aitrios.sony-semicon.com/en/documents/read-this-first)

## Versioning

This repository aims to adhere to Semantic Versioning 2.0.0.

## Branch

See the "**Release Note**" from [**Releases**] for this repository.

Each release is generated in the main branch. Pre-releases are generated in the develop branch. Releases will not be provided by other branches.

## Security
Before using Codespaces, please read the Site Policy of GitHub and understand the usage conditions. 
