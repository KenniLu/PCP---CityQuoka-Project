'use client'

import React, { useState, useEffect, useCallback } from 'react'

interface SocialLink {
  name: string
  profile: string
}

const SOCIAL_NETWORKS = [
  { id: 'facebook', label: 'Facebook', placeholder: 'facebook.com/username' },
  { id: 'instagram', label: 'Instagram', placeholder: '@username' },
  { id: 'tiktok', label: 'TikTok', placeholder: '@username' },
  { id: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/username' },
  { id: 'twitter', label: 'Twitter', placeholder: '@username' },
  { id: 'youtube', label: 'YouTube', placeholder: 'youtube.com/c/channelname' },
  { id: 'pinterest', label: 'Pinterest', placeholder: 'pinterest.com/username' },
  { id: 'snapchat', label: 'Snapchat', placeholder: '@username' },
]

const SOCIAL_ICONS: { [key: string]: React.ReactNode } = {
  facebook: (
    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  ),
  instagram: (
    <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
    </svg>
  ),
  tiktok: (
    <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>
  ),
  linkedin: (
    <svg className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  ),
  twitter: (
    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
    </svg>
  ),
  youtube: (
    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  pinterest: (
    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
    </svg>
  ),
  snapchat: (
    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.206 21.961c-.145 0-.283-.007-.424-.011-.878.01-1.745-.176-2.446-.579a3.233 3.233 0 01-1.368-1.292 3.037 3.037 0 01-.431-1.396c-.03-.276-.033-.413-.033-.413l-.005-.188c-.01-.058-.198-4.824 2.196-5.914a1.058 1.058 0 00.219-.141c.032-.027.062-.056.084-.084a.626.626 0 00.091-.142.328.328 0 00.023-.175.273.273 0 00-.093-.142 1.084 1.084 0 00-.143-.09 1.105 1.105 0 01-.191-.097 3.588 3.588 0 01-.522-.443 2.25 2.25 0 01-.474-.707 1.895 1.895 0 01-.053-1.324c.173-.43.5-.75.898-.967a2.87 2.87 0 011.29-.318c.292 0 .574.04.828.119a2.65 2.65 0 01.992.591c.121.11.228.248.312.405a.718.718 0 01.088.337.63.63 0 01-.034.196c-.051.152-.144.28-.265.376a.986.986 0 01-.554.176.95.95 0 01-.132-.01.703.703 0 01-.13-.032.731.731 0 00-.173-.033.525.525 0 00-.393.207c-.105.133-.179.33-.162.507.058.591.526.936 1.12 1.212a6.762 6.762 0 001.928.499l.258.019c.128.01.266.01.393.01.877 0 1.438-.211 1.764-.409.343-.195.688-.53.688-.53.204.195.683.183.683.183l.264.01c.136 0 .25-.01.348-.19.098-.01.19-.02.278-.03a.626.626 0 01.504.15c.146.135.223.332.183.525a.52.52 0 01-.21.341.724.724 0 01-.27.126c-.152.033-.3.047-.45.063-.102.01-.21.022-.31.033-.54.061-1.144.133-1.749.32-.36.113-.77.288-1.078.626-.25.283-.412.646-.417 1.029v.001c-.004.22-.01.44.018.658.026.21.09.404.208.575a.71.71 0 00.265.238c.222.113.464.173.73.225a2.9 2.9 0 00.268.044c.3.037.595.05.892.075l.2.017c.11.01.225.02.335.034.072.01.144.019.215.032.17.033.341.069.5.125a.847.847 0 01.543.689c.043.409-.187.78-.545.984-.135.077-.243.153-.32.212a1.632 1.632 0 00-.201.195c-.265.32-.47.676-.611 1.057a3.64 3.64 0 00-.162.568 2.87 2.87 0 01-.779 1.313 3.326 3.326 0 01-2.743.992 5.072 5.072 0 01-.856-.113 4.863 4.863 0 01-1.028-.364 6.235 6.235 0 01-1.482-.917 2.816 2.816 0 01-.431-.495A3.234 3.234 0 0111 21.831a3.38 3.38 0 01-.794.128l-.001.002z" />
    </svg>
  ),
}

interface SocialLinksEditorProps {
  value: SocialLink[]
  onSubmit: (links: SocialLink[]) => void
  handleBack: () => void
}

const SocialLinksEditor: React.FC<SocialLinksEditorProps> = ({ value, onSubmit, handleBack }) => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(value || [])

  const [availableNetworks, setAvailableNetworks] = useState<typeof SOCIAL_NETWORKS>([])

  const updateAvailableNetworks = useCallback(() => {
    const usedNetworks = socialLinks.map((link) => link.name)
    setAvailableNetworks(SOCIAL_NETWORKS.filter((network) => !usedNetworks.includes(network.id)))
  }, [socialLinks])

  useEffect(() => {
    updateAvailableNetworks()
  }, [updateAvailableNetworks, socialLinks])

  const addSocialLink = () => {
    if (availableNetworks.length === 0) return

    setSocialLinks([...socialLinks, { name: '', profile: '' }])
  }

  const removeSocialLink = (index: number) => {
    const updatedLinks = [...socialLinks]
    updatedLinks.splice(index, 1)
    setSocialLinks(updatedLinks)
  }

  // Update a social link at the given index
  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    const updatedLinks = [...socialLinks]
    updatedLinks[index] = {
      ...updatedLinks[index],
      [field]: value,
    }
    setSocialLinks(updatedLinks)
  }

  const getProfilePlaceholder = (networkName: string) => {
    const network = SOCIAL_NETWORKS.find((n) => n.id === networkName)
    return network?.placeholder || 'Enter profile URL or handle'
  }

  const getSocialIcon = (networkName: string) => {
    return SOCIAL_ICONS[networkName] || null
  }

  const disableAddLink =
    availableNetworks.length === 0 ||
    socialLinks.some((socialLink) => socialLink.profile.length === 0)

  return (
    <div className="space-y-4">
      {socialLinks.length === 0 && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add any social media links by clicking on the button below
        </label>
      )}

      <div className="space-y-3">
        {socialLinks.map((link, index) => (
          <div
            key={index}
            className="flex items-start space-x-3 p-3 bg-white rounded-md border border-gray-300 shadow-sm"
          >
            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor={`social-network-${index}`}
                  className="block text-xs font-medium text-gray-500 mb-1"
                >
                  Social Network
                </label>
                <div className="relative">
                  <select
                    id={`social-network-${index}`}
                    value={link.name}
                    onChange={(e) => updateSocialLink(index, 'name', e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                  >
                    <option value="" disabled>
                      Select a network
                    </option>
                    {link.name && (
                      <option value={link.name}>
                        {SOCIAL_NETWORKS.find((n) => n.id === link.name)?.label || link.name}
                      </option>
                    )}
                    {availableNetworks.map((network) => (
                      <option key={network.id} value={network.id}>
                        {network.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor={`social-profile-${index}`}
                  className="block text-xs font-medium text-gray-500 mb-1"
                >
                  Profile URL/Handle
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  {link.name && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {getSocialIcon(link.name)}
                    </div>
                  )}
                  <input
                    type="text"
                    id={`social-profile-${index}`}
                    value={link.profile}
                    onChange={(e) => updateSocialLink(index, 'profile', e.target.value)}
                    placeholder={getProfilePlaceholder(link.name)}
                    className={`block w-full ${link.name ? 'pl-10' : 'pl-3'} pr-3 py-2 sm:text-sm border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500`}
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => removeSocialLink(index)}
              className="inline-flex items-center p-1.5 border border-transparent rounded-full text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {availableNetworks.length > 0 && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={addSocialLink}
            disabled={disableAddLink}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
            ${
              disableAddLink
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clipRule="evenodd"
              />
            </svg>
            Add Social Link
          </button>
        </div>
      )}
      <hr/>
      <div className="mt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={disableAddLink}
          onClick={() => onSubmit(socialLinks)}
          className={`ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
            disableAddLink
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500'
          }`}
        >
          Submit
        </button>
      </div>
    </div>
  )
}

export default SocialLinksEditor
