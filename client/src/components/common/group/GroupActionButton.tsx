import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'

interface Props {
      isKicked: boolean
      onRemoveGroup: () => void
      onLeaveFromGroup: () => void
}

export default function GroupActionButton ({ isKicked, onRemoveGroup, onLeaveFromGroup }: Props): JSX.Element {
      const handleClick = isKicked ? onRemoveGroup : onLeaveFromGroup
      const actionText = isKicked ? 'Delete Chat' : 'Leave The Group'

      return (
            <div
                  className="p-4 mt-2 flex gap-x-2 hover:bg-gray-100 dark:hover:bg-dark-default-hover-bg cursor-pointer"
                  onClick={handleClick}
            >
                  <div className="text-red-600">
                        <LogoutOutlinedIcon />
                  </div>
                  <div>
                        {actionText}
                  </div>
            </div>
      )
}
