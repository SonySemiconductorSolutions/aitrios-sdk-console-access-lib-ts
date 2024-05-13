/*
 * Copyright 2022, 2023, 2024 Sony Semiconductor Solutions Corp. All rights reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Client, Config, DeployDeviceAppStatus, DeployByConfigurationStatus, Logger, PublishModelStatus, } from 'consoleaccesslibrary';

import yaml = require('js-yaml');
import * as fs from 'fs';
import * as path from 'path'
import { format } from 'date-fns'

/**
 * Class for Execute Console Access Library API
 */
export class APIExecutor {

    prevPublishCallbackStatus;

    constructor() { }


    deployCallback = (deployStatusArray) => {
        /** 
         * Callback for deploy status
         */
        console.log('************Callback for deploy status*****************');
        deployStatusArray.forEach((deployStatusItem) => {
            const deployDeviceId = Object.keys(deployStatusItem)[0]
            const status = deployStatusItem[deployDeviceId]["status"];
            if (status == DeployByConfigurationStatus.DEPLOYING)
                console.log("Deployment In Progress - ", deployDeviceId)
            else if (status == DeployByConfigurationStatus.SUCCESSFUL)
                console.log("Deployment Completed - ", deployDeviceId)
            else if (status == DeployByConfigurationStatus.FAILED)
                console.log("Deployment Failed - ", deployDeviceId)
            else if (status == DeployByConfigurationStatus.CANCELED)
                console.log("Deployment Canceled - ", deployDeviceId)
            else if (status == DeployByConfigurationStatus.DEVICEAPP_UNDEPLOY)
                console.log("Device app undeploy - ", deployDeviceId)
            else {
                console.log(deployDeviceId, "Error - ", deployDeviceId)
                process.exit();
            }
        })
    }

    publishCallback = (status: any) => {
        /** 
         * Callback for publish model status
         */
        console.log('************Callback for publish model status*****************');
        if (status != this.prevPublishCallbackStatus) {
            if (status == PublishModelStatus.BEFORE_CONVERSION)
                console.log("Before Conversion");
            else if (status == PublishModelStatus.CONVERTING)
                console.log("Converting");
            else if (status == PublishModelStatus.CONVERSION_FAILED)
                console.log("Conversion Failed");
            else if (status == PublishModelStatus.CONVERSION_COMPLETE)
                console.log("Conversion Completed");
            else if (status == PublishModelStatus.ADDING_TO_CONFIGURATION)
                console.log("Add To Configuration");
            else if (status == PublishModelStatus.ADD_TO_CONFIGURATION_FAILED)
                console.log("Add To Configuration Failed");
            else if (status == PublishModelStatus.ADD_TO_CONFIGURATION_COMPLETE)
                console.log("Add To Configuration Completed");
            else if (status == PublishModelStatus.SAVING)
                console.log("Saving");
            else {
                console.log("Error")
                process.exit();
            }
            this.prevPublishCallbackStatus = status
        } else {
            console.log(".");
        }
    }

    deployDeviceAppCallback = (deployStatusArray) => {
        /** 
         * Callback for Deploy Device App status
         */
        console.log('************Callback for Deploy Device App status*****************');

        deployStatusArray.forEach((deployStatusItem) => {
            const deployDeviceId = Object.keys(deployStatusItem)[0];
            const status = deployStatusItem[deployDeviceId]["status"];
            if (status == DeployDeviceAppStatus.DEPLOYING)
                console.log("Deployment In Progress - ", deployDeviceId)
            else if (status == DeployDeviceAppStatus.DEPLOYMENT_DONE)
                console.log("Deployment Completed - ", deployDeviceId)
            else if (status == DeployDeviceAppStatus.DEPLOYMENT_FAILED)
                console.log("Deployment Failed - ", deployDeviceId)
            else if (status == DeployDeviceAppStatus.DEPLOYMENT_CANCELED)
                console.log("Deployment Canceled - ", deployDeviceId)
            else {
                console.log("Error - ", deployDeviceId)
                process.exit();
            }
        })
    }

    async execute() {
        try {
            fs.promises.lstat("./demo_config.yaml").then(async stats => {
                if (stats.isSymbolicLink()) {
                    Logger.info('The path to configuration file is a symbolic link');
                    process.exit();
                }
                else {
                    // Read the Configurations
                    const demoConfigDataSchema = yaml.load(fs.readFileSync('./demo_config.yaml', { encoding: 'utf8', flag: 'r' }));
                    const demoConfigurations = demoConfigDataSchema["demo_configuration"];
                    let config
                    const SETTING_FILE_PATH = path.join('.', 'console_access_settings.yaml')
                    if (fs.existsSync(SETTING_FILE_PATH)) {
                        if (stats.isSymbolicLink()) {
                            Logger.info('The path to configuration file is a symbolic link');
                            process.exit();
                        }
                        // Read the Console Access Settings
                        const consoleAccessSettingData = yaml.load(fs.readFileSync('./console_access_settings.yaml', { encoding: 'utf8', flag: 'r' }));
                        const consoleAccessSettings = consoleAccessSettingData["console_access_settings"];
                        const { console_endpoint, portal_authorization_endpoint, client_secret, client_id, application_id } = consoleAccessSettings;
                        config = new Config(console_endpoint, portal_authorization_endpoint, client_id, client_secret, application_id === null ? undefined : application_id);
                    } else {
                        config = new Config(
                            null,
                            null,
                            null,
                            null,
                            null
                        )
                    }
                    
                    //Required parameter
                    const {
                        device_id: deviceId,
                        model_id: modelId,
                        model: model,
                        config_id: configId,
                        app_name: appName,
                        sub_directory_name: subDirectoryName,
                        version_number: versionNumber,
                        file_content_name: fileContentName,
                    } = demoConfigurations

                    //Option parameter
                    const {
                        get_model_device_id: getModelDeviceId,
                        publish_model_wait_response_device_id: publishModelWaitResponseDeviceId,
                        converted,
                        vendor_name: vendorName,
                        comment,
                        input_format_param: inputFormatParam,
                        network_config: networkConfig,
                        network_type: networkType,
                        metadata_format_id: metadataFormatId,
                        project_name: projectName,
                        model_platform: modelPlatform,
                        project_type: projectType,
                        latest_type: latestType,
                        sensor_loader_version_number: sensorLoaderVersionNumber,
                        sensor_version_number: sensorVersionNumber,
                        model_version_number: modelVersionNumber,
                        ap_fw_version_number: apFwVersionNumber,
                        device_ids: deviceIds,
                        replace_model_id: replaceModelId,
                        timeout,
                        entry_point: entryPoint,
                        schema_info: schemaInfo,
                        device_name: deviceName,
                        from_datetime: fromDatetime,
                        to_datetime: toDatetime,
                        connection_state: connectionState,
                        device_group_id: deviceGroupId,
                        scope,
                        number_of_images: numberOfImages,
                        skip,
                        order_by: orderBy,
                        number_of_inference_results: numberOfInferenceResults,
                        filter,
                        raw,
                        time
                    } = demoConfigurations

                    const fileContentPath = path.join('.', fileContentName)
                    let fileContent
                    let compiledFlg
                    if (fs.existsSync(fileContentPath)) {
                        if (fs.lstatSync(fileContentPath).isSymbolicLink()) {
                            Logger.info("Can't open symbolic link file.");
                            process.exit();
                        }
                        const fileEncodeContent = fs.readFileSync(fileContentPath).toString('base64')
                        fileContent = Buffer.from(fileEncodeContent).toString('utf-8')
                        const fileContentExtension = fileContentName.split('.').pop()
                        if (fileContentExtension === 'aot') {
                            compiledFlg = "1"
                        } else if (fileContentExtension ==="wasm") {
                            compiledFlg = "0"
                        } else {
                            Logger.info("The extension of file_content_name is not appropriate.");
                            process.exit();
                        }
                    } else {
                        Logger.info("file_content_name is not exist.");
                        process.exit();
                    }

                    
                    // Create instance of Client
                    var client = await Client.createInstance(config);

                    let response;

                    // AIModel - ImportBaseModel
                    try {
                        response = await client?.aiModel?.importBaseModel(
                            modelId,
                            model,
                            converted === null ? undefined : converted,
                            vendorName === null ? undefined : vendorName,
                            comment === null ? undefined : comment,
                            inputFormatParam === null ? undefined : inputFormatParam,
                            networkConfig === null ? undefined : networkConfig,
                            networkType === null ? undefined : networkType,
                            metadataFormatId === null ? undefined : metadataFormatId);
                        console.log('************************************************************************');
                        console.log('************************************************************************');
                        if ('data' in response) {
                            response = JSON.stringify(response.data);
                        } else {
                            response = JSON.stringify(response)
                        }
                        console.log("ImportBaseModel response: ", response);
                    } catch (e) {
                        console.log("ImportBaseModel Exception: ", e);
                    }

                    // AIModel - GetModels
                    try {
                        response = await client?.aiModel?.getModels(
                            modelId === null ? undefined : modelId,
                            comment === null ? undefined : comment,
                            projectName === null ? undefined : projectName,
                            modelPlatform === null ? undefined : modelPlatform,
                            projectType === null ? undefined : projectType,
                            getModelDeviceId === null ? undefined : getModelDeviceId,
                            latestType === null ? undefined : latestType);
                        console.log('************************************************************************');
                        console.log('************************************************************************');
                        if ('data' in response) {
                            response = JSON.stringify(response.data);
                        } else {
                            response = JSON.stringify(response)
                        }
                        console.log("GetModels response: ", response);
                    } catch (e) {
                        console.log("GetModels Exception: ", e);
                    }

                    // AIModel - GetBaseModelStatus
                    try {
                        response = await client?.aiModel?.getBaseModelStatus(
                            modelId,
                            latestType === null ? undefined : latestType);
                        console.log('************************************************************************');
                        console.log('************************************************************************');
                        if ('data' in response) {
                            response = JSON.stringify(response.data);
                        } else {
                            response = JSON.stringify(response)
                        }
                        console.log("GetBaseModelStatus response: ", response);
                    } catch (e) {
                        console.log("GetBaseModelStatus Exception: ", e);
                    }

                    // AIModel - PublishModelWaitResponse
                    try {
                        response = await client?.aiModel?.publishModelWaitResponse(
                            modelId,
                            publishModelWaitResponseDeviceId === null ? undefined : publishModelWaitResponseDeviceId,
                            this.publishCallback);
                        console.log('************************************************************************');
                        console.log('************************************************************************');
                        if ('data' in response) {
                            response = JSON.stringify(response.data);
                        } else {
                            response = JSON.stringify(response)
                        }
                        console.log("PublishModelWaitResponse response: ", response);
                    } catch (e) {
                        console.log("PublishModelWaitResponse Exception: ", e);
                    }

                    // Deployment - CreateDeployConfiguration
                    try {
                        response = await client?.deployment?.createDeployConfiguration(
                            configId,
                            comment === null ? undefined : comment,
                            sensorLoaderVersionNumber === null ? undefined : sensorLoaderVersionNumber,
                            sensorVersionNumber === null ? undefined : sensorVersionNumber,
                            modelId === null ? undefined : modelId,
                            modelVersionNumber === null ? undefined : modelVersionNumber,
                            apFwVersionNumber === null ? undefined : apFwVersionNumber);
                        console.log('************************************************************************');
                        console.log('************************************************************************');
                        if ('data' in response) {
                            response = JSON.stringify(response.data);
                        } else {
                            response = JSON.stringify(response)
                        }
                        console.log("CreateDeployConfiguration response: ", response);
                    } catch (e) {
                        console.log("CreateDeployConfiguration Exception: ", e);
                    }

                    // Deployment - DeployByConfigurationWaitResponse
                    try {
                        response = await client?.deployment?.deployByConfigurationWaitResponse(
                            configId,
                            deviceIds === null ? undefined : deviceId,
                            replaceModelId === null ? undefined : replaceModelId,
                            comment === null ? undefined : comment,
                            timeout === null ? undefined : timeout,
                            this.deployCallback);
                        console.log('************************************************************************');
                        console.log('************************************************************************');
                        if ('data' in response) {
                            response = JSON.stringify(response.data);
                        } else {
                            response = JSON.stringify(response)
                        }
                        console.log("DeployByConfigurationWaitResponse response: ", response);
                    } catch (e) {
                        console.log("DeployByConfigurationWaitResponse Exception: ", e);
                    }

                    // Deployment - CancelDeployment
                    try {
                        await client?.deployment?.deployByConfiguration(
                            configId,
                            deviceIds === null ? undefined : deviceId,
                            replaceModelId === null ? undefined : replaceModelId,
                            comment === null ? undefined : comment);
                        const responseDeployHistory = await client?.deployment?.getDeployHistory(deviceId);
                        console.log('configId : ' + configId)
                        let deployIdHistory
                        for (let i in responseDeployHistory.data.deploys) {
                            if (configId === responseDeployHistory.data.deploys[i].config_id && responseDeployHistory.data.deploys[i].deploy_status === "7") {
                                console.log('deployIdHistory: ' + responseDeployHistory.data.deploys[i].id)
                                deployIdHistory = responseDeployHistory.data.deploys[i].id
                                break
                            }
                        }
                        response = await client?.deployment?.cancelDeployment(deviceId, String(deployIdHistory));
                        console.log('************************************************************************');
                        console.log('************************************************************************');
                        if ('data' in response) {
                            response = JSON.stringify(response.data);
                        } else {
                            response = JSON.stringify(response)
                        }
                        console.log("CancelDeployment response: ", response);
                    } catch (e) {
                        console.log("CancelDeployment Exception: ", e);
                    }

                    // Deployment - GetDeployConfigurations
                    try {
                        response = await client?.deployment?.getDeployConfigurations();
                        console.log('************************************************************************');
                        console.log('************************************************************************');
                        if ('data' in response) {
                            response = JSON.stringify(response.data);
                        } else {
                            response = JSON.stringify(response)
                        }
                        console.log("GetDeployConfigurations response: " + response);
                    } catch (e) {
                        console.log("GetDeployConfigurations Exception: " + e);
                    }

                    // Deployment - GetDeployHistory
                    try {
                        response = await client?.deployment?.getDeployHistory(deviceId);
                        console.log('************************************************************************');
                        console.log('************************************************************************');
                        if ('data' in response) {
                            response = JSON.stringify(response.data);
                        } else {
                            response = JSON.stringify(response)
                        }
                        console.log("GetDeployHistory response: ", response);
                    } catch (e) {
                        console.log("GetDeployHistory Exception: ", e);
                    }

                    // Deployment - ImportDeviceApp
                    try {
                        response = await client?.deployment?.importDeviceApp(
                            compiledFlg,
                            appName,
                            versionNumber,
                            fileContentName,
                            fileContent,
                            entryPoint === null ? undefined : entryPoint,
                            comment === null ? undefined : comment,
                            schemaInfo === null ? undefined : schemaInfo);
                        console.log('************************************************************************');
                        console.log('************************************************************************');
                        if ('data' in response) {
                            response = JSON.stringify(response.data);
                        } else {
                            response = JSON.stringify(response)
                        }
                        console.log("ImportDeviceApp response: ", response);
                    } catch (e) {
                        console.log("ImportDeviceApp Exception: ", e);
                    }

                    // Deployment - DeployDeviceAppWaitResponse
                    try {
                        let app_status = '0'
                        while (app_status != '2') {
                            const deviceAppsResponse = await client?.deployment?.getDeviceApps()
                            for (let i = 0; i < deviceAppsResponse['data']['apps'].length; i++) {
                                if (deviceAppsResponse['data']['apps'][i]['name'] === appName) {
                                    app_status = deviceAppsResponse['data']['apps'][i]['versions'][0]['status']
                                    if (app_status == '3') {
                                        Logger.info('ImportDeviceApp is failed.');
                                        process.exit();
                                    }
                                }
                            }
                        }
                        response = await client?.deployment?.deployDeviceAppWaitResponse(
                            appName,
                            versionNumber,
                            deviceIds === null ? undefined : deviceId,
                            comment === null ? undefined : comment,
                            this.deployDeviceAppCallback);
                        console.log('************************************************************************');
                        console.log('************************************************************************');
                        if ('data' in response) {
                            response = JSON.stringify(response.data);
                        } else {
                            response = JSON.stringify(response)
                        }
                        console.log("DeployDeviceAppWaitResponse response: ", response);
                    } catch (e) {
                        console.log("DeployDeviceAppWaitResponse Exception: ", e);
                    }

                    // Deployment - GetDeviceApps
                    try {
                        response = await client?.deployment?.getDeviceApps();
                        console.log('************************************************************************');
                        console.log('************************************************************************');
                        if ('data' in response) {
                            response = JSON.stringify(response.data);
                        } else {
                            response = JSON.stringify(response)
                        }
                        console.log("GetDeviceApps response: ", response);
                    } catch (e) {
                        console.log("GetDeviceApps Exception: ", e);
                    }

                    // Deployment - GetDeviceAppDeploys
                    try {
                        response = await client?.deployment?.getDeviceAppDeploys(appName, versionNumber);
                        console.log('************************************************************************');
                        console.log('************************************************************************');
                        if ('data' in response) {
                            response = JSON.stringify(response.data);
                        } else {
                            response = JSON.stringify(response)
                        }
                        console.log("GetDeviceAppDeploys response: ", response);
                    } catch (e) {
                        console.log("GetDeviceAppDeploys Exception: ", e);
                    }

                    // DeviceManagement - GetDevices
                    try {
                        response = await client?.deviceManagement?.getDevices(
                            deviceId === null ? undefined : deviceId,
                            deviceName === null ? undefined : deviceName,
                            connectionState === null ? undefined : connectionState,
                            deviceGroupId === null ? undefined : deviceGroupId,
                            deviceIds === null ? undefined : deviceId,
                            scope === null ? undefined : scope);
                        console.log('************************************************************************');
                        console.log('************************************************************************');
                        if ('data' in response) {
                            response = JSON.stringify(response.data);
                        } else {
                            response = JSON.stringify(response)
                        }
                        console.log("GetDevices response: " + response);
                    } catch (e) {
                        console.log("GetDevices Exception: " + e);
                    }

                    // DeviceManagement - StartUploadInferenceResult
                    try {
                        response = await client?.deviceManagement?.startUploadInferenceResult(deviceId);
                        console.log('************************************************************************');
                        console.log('************************************************************************');
                        if ('data' in response) {
                            response = JSON.stringify(response.data);
                        } else {
                            response = JSON.stringify(response)
                        }
                        console.log("StartUploadInferenceResult response: " + response);
                    } catch (e) {
                        console.log("StartUploadInferenceResult Exception: " + e);
                    }

                    // DeviceManagement - StopUploadInferenceResult
                    try {
                        response = await client?.deviceManagement?.stopUploadInferenceResult(deviceId);
                        console.log('************************************************************************');
                        console.log('************************************************************************');
                        if ('data' in response) {
                            response = JSON.stringify(response.data);
                        } else {
                            response = JSON.stringify(response)
                        }
                        console.log("StopUploadInferenceResult response: " + response);
                    } catch (e) {
                        console.log("StopUploadInferenceResult Exception: " + e);
                    }

                    // DeviceManagement - GetCommandParameterFile
                    try {
                        response = await client?.deviceManagement?.getCommandParameterFile();
                        console.log('************************************************************************');
                        console.log('************************************************************************');
                        if ('data' in response) {
                            response = JSON.stringify(response.data);
                        } else {
                            response = JSON.stringify(response)
                        }
                        console.log("GetCommandParameterFile response: " + response);
                    } catch (e) {
                        console.log("GetCommandParameterFile Exception: " + e);
                    }

                    // Insight - GetImageDirectories
                    try {
                        response = await client?.insight?.getImageDirectories(
                            deviceId === null ? undefined : deviceId);
                        console.log('************************************************************************');
                        console.log('************************************************************************');
                        if ('data' in response) {
                            response = JSON.stringify(response.data);
                        } else {
                            response = JSON.stringify(response)
                        }
                        console.log("GetImageDirectories response: " + response);
                    } catch (e) {
                        console.log("GetImageDirectories Exception: " + e);
                    }

                    //Insight - GetImages
                    try {
                        let fromTime = undefined
                        let toTime = undefined
                        if (fromDatetime === undefined && toDatetime === undefined) {
                            const convertedFromDate = new Date(
                                Number(subDirectoryName.slice(0, 4)),
                                Number(subDirectoryName.slice(4, 6)) - 1,
                                Number(subDirectoryName.slice(6, 8)),
                                Number(subDirectoryName.slice(8, 10)),
                                Number(subDirectoryName.slice(10, 12)),
                                Number(subDirectoryName.slice(12, 14)),
                                Number(subDirectoryName.slice(14, 17))
                            )
                            const convertedToDate = new Date(convertedFromDate.getTime() + 10 * 60 * 60 * 1000)
                            toTime = format(convertedToDate, 'yyyyMMddHHmm')
                        } else {
                            fromTime = fromDatetime
                            toTime = toDatetime
                        }
                        response = await client?.insight?.getImages(
                            deviceId,
                            subDirectoryName,
                            numberOfImages === null ? undefined : numberOfImages,
                            skip === null ? undefined : skip,
                            orderBy === null ? undefined : orderBy,
                            fromTime,
                            toTime);
                        console.log('************************************************************************');
                        console.log('************************************************************************');
                        if ('data' in response) {
                            response = JSON.stringify(response.data);
                        } else {
                            response = JSON.stringify(response)
                        }
                        console.log("GetImages response: " + response);
                    } catch (e) {
                        console.log("GetImages Exception: " + e);
                    }

                    // Insight - GetInferenceResults
                    try {
                        response = await client?.insight?.getInferenceResults(
                            deviceId,
                            filter === null ? undefined : filter,
                            numberOfInferenceResults === null ? undefined : numberOfInferenceResults,
                            raw === null ? undefined : raw,
                            time === null ? undefined : time);
                        console.log('************************************************************************');
                        console.log('************************************************************************');
                        if ('data' in response) {
                            response = JSON.stringify(response.data);
                        } else {
                            response = JSON.stringify(response)
                        }
                        console.log("GetInferenceResults response: " + response);
                    } catch (e) {
                        console.log("GetInferenceResults Exception: " + e);
                    }

                    // Insight - GetImageData
                    try {
                        let fromTime = undefined
                        let toTime = undefined
                        if (fromDatetime === undefined && toDatetime === undefined) {
                            const convertedFromDate = new Date(
                                Number(subDirectoryName.slice(0, 4)),
                                Number(subDirectoryName.slice(4, 6)) - 1,
                                Number(subDirectoryName.slice(6, 8)),
                                Number(subDirectoryName.slice(8, 10)),
                                Number(subDirectoryName.slice(10, 12)),
                                Number(subDirectoryName.slice(12, 14)),
                                Number(subDirectoryName.slice(14, 17))
                            )
                            const convertedToDate = new Date(convertedFromDate.getTime() + 10 * 60 * 60 * 1000)
                            toTime = format(convertedToDate, 'yyyyMMddHHmm')
                        } else {
                            fromTime = fromDatetime
                            toTime = toDatetime
                        }
                        response = await client?.insight?.getImageData(
                            deviceId,
                            subDirectoryName,
                            numberOfImages === null ? undefined : numberOfImages,
                            skip === null ? undefined : skip,
                            orderBy === null ? undefined : orderBy,
                            fromTime,
                            toTime);
                        console.log('************************************************************************');
                        console.log('************************************************************************');
                        if ('data' in response) {
                            response = JSON.stringify(response.data);
                        } else {
                            response = JSON.stringify(response)
                        }
                        console.log("GetImageData response: " + response);
                    } catch (e) {
                        console.log("GetImageData Exception: " + e);
                    }

                    // Insight - GetLastInferenceData
                    try {
                        response = await client?.insight?.getLastInferenceData(deviceId);
                        console.log('************************************************************************');
                        console.log('************************************************************************');
                        if ('data' in response) {
                            response = JSON.stringify(response.data);
                        } else {
                            response = JSON.stringify(response)
                        }
                        console.log("GetLastInferenceData response: " + response);
                    } catch (e) {
                        console.log("GetLastInferenceData Exception: " + e);
                    }

                    // Insight - GetLastInferenceAndImageData
                    try {
                        response = await client?.insight?.getLastInferenceAndImageData(deviceId, subDirectoryName);
                        console.log('************************************************************************');
                        console.log('************************************************************************');
                        if ('data' in response) {
                            response = JSON.stringify(response.data);
                        } else {
                            response = JSON.stringify(response)
                        }
                        console.log("GetLastInferenceAndImageData response: " + response);
                    } catch (e) {
                        console.log("GetLastInferenceAndImageData Exception: " + e);
                    }

                    // AIModel - DeleteModel
                    try {
                        response = await client?.aiModel?.deleteModel(modelId);
                        console.log('************************************************************************');
                        console.log('************************************************************************');
                        if ('data' in response) {
                            response = JSON.stringify(response.data);
                        } else {
                            response = JSON.stringify(response)
                        }
                        console.log("DeleteModel response: ", response);
                    } catch (e) {
                        console.log("DeleteModel Exception: ", e);
                    }

                    // Deployment - UndeployDeviceApp
                    try {
                        response = await client?.deployment?.undeployDeviceApp(deviceIds === null ? undefined : deviceId);
                        console.log('************************************************************************');
                        console.log('************************************************************************');
                        if ('data' in response) {
                            response = JSON.stringify(response.data);
                        } else {
                            response = JSON.stringify(response)
                        }
                        console.log("UndeployDeviceApp response: ", response);
                    } catch (e) {
                        console.log("UndeployDeviceApp Exception: ", e);
                    }

                    // Deployment - DeleteDeviceApp
                    try {
                        response = await client?.deployment?.deleteDeviceApp(appName, versionNumber);
                        console.log('************************************************************************');
                        console.log('************************************************************************');
                        if ('data' in response) {
                            response = JSON.stringify(response.data);
                        } else {
                            response = JSON.stringify(response)
                        }
                        console.log("DeleteDeviceApp response: ", response);
                    } catch (e) {
                        console.log("DeleteDeviceApp Exception: ", e);
                    }

                    // Deployment - DeleteDeployConfiguration
                    try {
                        response = await client?.deployment?.deleteDeployConfiguration(configId);
                        console.log('************************************************************************');
                        console.log('************************************************************************');
                        if ('data' in response) {
                            response = JSON.stringify(response.data);
                        } else {
                            response = JSON.stringify(response)
                        }
                        console.log("DeleteDeployConfiguration response: ", response);
                    } catch (e) {
                        console.log("DeleteDeployConfiguration Exception: ", e);
                    }
                }
            });

        } catch (e) {
            console.log("Exception: " + e);
        }
        console.log("All API's executions completed!!!");
    }
}
