import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FirebaseClient } from '@/clients/firebase'
import { LogoutService } from '@/services/logout-service'

const client = new FirebaseClient()
const logoutService = new LogoutService()

export function UserNav() {
  const user = client.getAuth().currentUser
  const metadata = {
    username: user && user.displayName ? user.displayName : 'Admin',
    email: user && user.email ? user.email : '',
    avatar: user && user.photoURL ? user.photoURL : '/avatars/01.png',
  }
  const splittedUsername = metadata.username.split(' ')
  const hasManyNames = splittedUsername.length > 1
  const avatarFallback = hasManyNames
    ? splittedUsername
        .slice(0, 2)
        .reduce((accumulator, value) => accumulator + value.charAt(0), '')
        .toUpperCase()
    : splittedUsername.join().substring(0, 2).toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src={metadata.avatar} alt='@shadcn' />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>
              {metadata.username}
            </p>
            <p className='text-xs leading-none text-muted-foreground'>
              {metadata.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logoutService.handle()}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
