'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class NotionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Notion 渲染错误:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-50">
          <div className="max-w-md p-6 bg-white rounded-lg shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-red-500" size={24} />
              <h2 className="text-lg font-semibold text-gray-900">
                页面渲染出错
              </h2>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              抱歉，渲染此 Notion 页面时遇到问题。这可能是因为页面包含了不支持的内容类型。
            </p>

            {this.state.error && (
              <div className="mb-4 p-3 bg-red-50 rounded border border-red-200">
                <p className="text-xs font-mono text-red-800 break-words">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <RefreshCw size={16} />
                <span>重新加载</span>
              </button>

              <p className="text-xs text-gray-500 text-center">
                如果问题持续，请尝试使用 Notion 官方应用查看此页面
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
