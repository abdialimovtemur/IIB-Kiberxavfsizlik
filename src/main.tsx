import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { ConfigProvider } from 'antd'
import uz_UZ from 'antd/locale/uz_UZ'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider locale={uz_UZ}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
)
