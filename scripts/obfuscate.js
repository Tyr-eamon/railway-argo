// 把「配置头 + 原文明码正文」混淆后写入 index.js
// 用法:
//   CONFIG 配置块通过环境变量 CONFIG_FILE 指向的文件传入(由工作流写入)
//   若不提供 CONFIG_FILE,则直接用 原文明码 的完整内容(本地手动跑时用)
const fs = require("fs");
const path = require("path");
const JavaScriptObfuscator = require("javascript-obfuscator");

const ROOT = path.resolve(__dirname, "..");
const SOURCE = path.join(ROOT, "原文明码");   // 明文源码(含配置头 + 正文)
const OUTPUT = path.join(ROOT, "index.js");   // 混淆后输出
const BODY_MARKER = "// 创建运行文件夹";        // 正文起点标记(配置头与正文的分界)

function buildSource() {
  const original = fs.readFileSync(SOURCE, "utf8");
  const markerIdx = original.indexOf(BODY_MARKER);
  if (markerIdx === -1) {
    throw new Error(`在 原文明码 中找不到正文标记: ${BODY_MARKER}`);
  }
  const body = original.slice(markerIdx); // 正文(从标记开始,到文件末尾)

  const configFile = process.env.CONFIG_FILE;
  if (configFile && fs.existsSync(configFile)) {
    const config = fs.readFileSync(configFile, "utf8").trimEnd();
    console.log("使用工作流传入的配置块替换头部");
    return config + "\n\n" + body;
  }

  console.log("未提供 CONFIG_FILE,直接使用 原文明码 完整内容");
  return original;
}

const source = buildSource();

// 混淆参数:与常用在线混淆器的中高强度预设一致,既保护代码又不破坏功能
const result = JavaScriptObfuscator.obfuscate(source, {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  deadCodeInjection: false,
  numbersToExpressions: true,
  simplify: true,
  stringArray: true,
  stringArrayEncoding: ["base64"],
  stringArrayThreshold: 0.75,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  splitStrings: true,
  splitStringsChunkLength: 10,
  transformObjectKeys: true,
  unicodeEscapeSequence: false,
});

fs.writeFileSync(OUTPUT, result.getObfuscatedCode());
console.log(`已混淆并写入 ${OUTPUT} (${result.getObfuscatedCode().length} 字节)`);
