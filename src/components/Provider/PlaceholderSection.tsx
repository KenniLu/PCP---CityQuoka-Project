import React from 'react'

type Args = {
  title: string
  description: string
  icon?: string
}

export const PlaceholderSection = ({ title, description, icon }: Args) => {
  return (
    <section className="w-full">
      <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center bg-gray-50">
        <div className="flex flex-col items-center justify-center space-y-4">
          {icon && (
            <div className="text-4xl opacity-50">
              {icon}
            </div>
          )}
          
          <h2 className="text-2xl font-bold text-gray-900">
            {title}
          </h2>
          
          <p className="text-gray-600 max-w-md">
            {description}
          </p>
          
          <div className="text-sm text-gray-400">
            Coming Soon
          </div>
        </div>
      </div>
    </section>
  )
}