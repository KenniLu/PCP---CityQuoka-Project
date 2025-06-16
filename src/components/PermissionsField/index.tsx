'use client'

import { useField } from '@payloadcms/ui'
import React, { useState, useEffect } from 'react'
import { PERMISSION_KEYS } from '@/types/permissions'

interface PermissionItem {
  read?: boolean
  admin?: boolean
}

interface Permissions {
  admin?: boolean
  [key: string]: boolean | PermissionItem | undefined
}

interface PermissionsFieldProps {
  path: string
  label?: string
  required?: boolean
}

const PermissionsField: React.FC<PermissionsFieldProps> = ({
  path,
  label = 'Permissions',
  required,
}) => {
  const { value, setValue } = useField<Permissions>({ path })

  // Initialize permissions state
  const [permissions, setPermissions] = useState<Permissions>(() => {
    if (value && typeof value === 'object') {
      return value
    }
    // Default permissions structure
    const defaultPerms: Permissions = { admin: false }
    PERMISSION_KEYS.forEach((category) => {
      defaultPerms[category] = { read: true, admin: false }
    })
    return defaultPerms
  })

  // Update field value when permissions change
  useEffect(() => {
    setValue(permissions)
  }, [permissions, setValue])

  // Handle top-level admin change
  const handleGlobalAdminChange = (checked: boolean) => {
    const newPermissions: Permissions = { ...permissions, admin: checked }
    setPermissions(newPermissions)
  }

  // Handle category-specific permission changes
  const handleCategoryPermissionChange = (
    category: string,
    permissionType: 'read' | 'admin',
    checked: boolean,
  ) => {
    const newPermissions = { ...permissions }
    const categoryPerms = (newPermissions[category] as PermissionItem) || {}

    if (permissionType === 'admin') {
      categoryPerms.admin = checked
    } else {
      categoryPerms.read = checked
    }

    newPermissions[category] = categoryPerms
    setPermissions(newPermissions)
  }

  const isPermissionChecked = (category: string, permissionType: 'read' | 'admin'): boolean => {
    if (permissions.admin) {
      return true
    }
    const categoryPerms = permissions[category] as PermissionItem
    if (permissionType === 'read') {
      return true
    } else {
      return categoryPerms?.[permissionType] || false
    }
  }

  const isPermissionDisabled = (category: string, permissionType: 'read' | 'admin'): boolean =>
    permissions.admin === true

  return (
    <div className="permissions-field">
      <label className="field-label">
        {label}
        {required && <span className="required-indicator">*</span>}
      </label>

      {/* Global Admin Toggle */}
      <div className="global-admin">
        <label>
          <input
            type="checkbox"
            checked={permissions.admin || false}
            onChange={(e) => handleGlobalAdminChange(e.target.checked)}
          />
          Global Admin (enables all permissions)
        </label>
      </div>

      {/* Permissions Table */}
      <table className="permissions-table">
        <thead>
          <tr>
            <th>Category</th>
            <th style={{ textAlign: 'center', width: '100px' }}>Read</th>
            <th style={{ textAlign: 'center', width: '100px' }}>Admin</th>
          </tr>
        </thead>
        <tbody>
          {PERMISSION_KEYS.map((category) => (
            <tr key={category}>
              <td>
                <span className="category-name">
                  {category
                    .split('-')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </span>
              </td>
              <td className="permission-checkbox">
                <input type="checkbox" checked={true} disabled={true} />
              </td>
              <td className="permission-checkbox">
                <input
                  type="checkbox"
                  checked={isPermissionChecked(category, 'admin')}
                  disabled={isPermissionDisabled(category, 'admin')}
                  onChange={(e) =>
                    handleCategoryPermissionChange(category, 'admin', e.target.checked)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PermissionsField
