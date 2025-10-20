# RabbitMQ MCP Lite模式 + Custom API 实施计划

## 项目概述
优化 RabbitMQ MCP 项目，添加 lite 模式控制工具数量在20个以内，并增加 custom_api 接口支持自定义调用任意 RabbitMQ HTTP API。

## 背景信息
- 当前项目：114个工具，分为15个功能模块
- 目标：lite 模式下仅20个核心工具
- 工具分组：开发相关60个，运维相关54个
- 优先级：先实现 lite 模式，再实现 custom_api

## 实施方案
基于配置的工具过滤机制：
1. 创建工具配置文件定义 lite 模式工具列表
2. 添加命令行参数解析 --lite
3. 实现工具过滤函数
4. 创建 custom_api 工具
5. 完善测试覆盖

## 实施步骤

### 阶段 1：Lite 模式实现
1. 创建工具配置文件 `src/config/lite-tools.ts`
2. 添加命令行参数解析
3. 实现工具过滤函数
4. 修改工具注册机制

### 阶段 2：Custom API 实现
1. 创建 Custom API 工具 `src/tools/custom.ts`
2. 实现参数验证
3. 集成到工具导出

### 阶段 3：测试和验证
1. 单元测试
2. 集成测试

## 预期结果
- 支持 `--lite` 模式启动，工具数量控制在20个以内
- custom_api 工具支持完整 RabbitMQ HTTP API 调用
- 保持现有功能完整性

## 开始时间
2025-10-20 14:52:21