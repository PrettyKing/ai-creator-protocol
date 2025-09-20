export default function TestStyles() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-4xl font-bold text-blue-400 mb-8">样式测试页面</h1>

      <div className="test-styles-loaded p-4 mb-4 rounded">
        <p>如果看到红色背景，说明CSS正常工作</p>
      </div>

      <div className="bg-slate-800 p-6 rounded-lg border border-blue-500/20 mb-4">
        <h2 className="text-2xl font-semibold text-green-400 mb-4">Tailwind 样式测试</h2>
        <p className="text-blue-200 mb-4">这应该是蓝色文字</p>
        <button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300">
          渐变按钮
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-500/20 border border-red-500/40 p-4 rounded-lg">
          <h3 className="text-red-400 font-semibold">红色卡片</h3>
        </div>
        <div className="bg-green-500/20 border border-green-500/40 p-4 rounded-lg">
          <h3 className="text-green-400 font-semibold">绿色卡片</h3>
        </div>
        <div className="bg-purple-500/20 border border-purple-500/40 p-4 rounded-lg">
          <h3 className="text-purple-400 font-semibold">紫色卡片</h3>
        </div>
      </div>
    </div>
  )
}