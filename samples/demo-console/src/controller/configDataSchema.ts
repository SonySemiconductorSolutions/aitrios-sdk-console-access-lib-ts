/*
 * Copyright 2022, 2023 Sony Semiconductor Solutions Corp. All rights reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Schema definitions for demo configurations

export interface DemoConfigDataSchema {
    demo_configuration: DemoConfigurationSchema;
}

export interface DemoConfigurationSchema {
    device_id: string;
    get_model_device_id: string;
    publish_model_wait_response_device_id: string;
    model_id: string;
    model: string;
    converted: string;
    vendor_name: string;
    comment: string;
    input_format_param: string;
    network_config: string;
    network_type: string;
    metadata_format_id: string;
    project_name: string;
    model_platform: string;
    project_type: string;
    latest_type: string;
    config_id: string;
    sensor_loader_version_number: string;
    sensor_version_number: string;
    model_version_number: string;
    ap_fw_version_number: string;
    device_ids: string;
    replace_model_id: string;
    timeout: number;
    compiled_flg: string;
    app_name: string;
    version_number: string
    file_name: string;
    entry_point: string;
    schema_info: object;
    device_name: string;
    connection_state: string;
    device_group_id: string;
    scope: string;
    sub_directory_name: string;
    number_of_images: number;
    skip: number;
    order_by: string;
    number_of_inference_results: number
    filter: string;
    raw: number;
    time: string;
}

// Schema definitions for console access settings
export interface ConsoleAccessSettingDataSchema {
    console_access_settings: ConsoleAccessSettingsSchema;
}

export interface ConsoleAccessSettingsSchema {
    console_endpoint: string;
    portal_authorization_endpoint: string;
    client_secret: string;
    client_id: string;
    application_id: string;
}
