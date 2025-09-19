#!/usr/bin/env node

/**
 * 文档索引生成脚本
 * 自动扫描md文件夹并生成文档列表
 */

const fs = require('fs');
const path = require('path');

const mdDir = path.join(__dirname, '../md');
const outputFile = path.join(mdDir, 'INDEX.md');

function generateDocsIndex() {
  try {
    const files = fs.readdirSync(mdDir)
      .filter(file => file.endsWith('.md') && file !== 'README.md' && file !== 'INDEX.md')
      .sort();

    let content = `# 文档索引\n\n自动生成于: ${new Date().toLocaleString('zh-CN')}\n\n`;

    content += `## 📚 可用文档 (${files.length}个)\n\n`;

    files.forEach(file => {
      const basename = path.basename(file, '.md');
      content += `- [${basename}](./${file})\n`;
    });

    content += `\n## 🔗 快速访问\n\n`;
    content += `- [返回项目首页](../README.md)\n`;
    content += `- [文档使用说明](README.md)\n`;

    fs.writeFileSync(outputFile, content);
    console.log(`✅ 文档索引已生成: ${outputFile}`);
    console.log(`📝 找到 ${files.length} 个文档文件`);

  } catch (error) {
    console.error('❌ 生成文档索引失败:', error);
  }
}

generateDocsIndex();