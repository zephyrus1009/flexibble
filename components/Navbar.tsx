//Navbar sẽ gồm 2 phần:
// phần 1: chứa các links nói chung
// phần 2: tuỳ vào user đã login chưa mà hiện khác nhau
import Image from "next/image";
import Link from "next/link";

import { NavLinks } from "@/constant";
import { getCurrentUser } from "@/lib/session";

import AuthProviders from "./AuthProviders";
import Button from "./Button";
import ProfileMenu from "./ProfileMenu";

const Navbar = async () => {
  const session = await getCurrentUser()

  return (
    <nav className='flexBetween navbar'>
      {/* phần 1 chứa các links */}
      <div className='flex-1 flexStart gap-10'>
        <Link href='/'>
          <Image
            src='/logo.svg'
            width={116}
            height={43}
            alt='logo'
          />
        </Link>
        <ul className='xl:flex hidden text-small gap-7'>
          {NavLinks.map((link) => (
            <Link href={link.href} key={link.text}>
              {link.text}
            </Link>
          ))}
        </ul>
        {/* NavLink được tạo dưới dạng một array các object nên ta có thể map ra để ul như trên. */}
      </div>
{/* phần 2 nếu user đã đăng nhập thì hiện các nút, info liên quan đên user */}
      <div className='flexCenter gap-4'>
        {session?.user ? (
          <>
            <ProfileMenu session={session} />

            <Link href="/create-project">
              <Button title='Share work' />
            </Link>
          </>
        ) : (
          <AuthProviders />
          // nếu user chưa đăng nhập thì hiện AuthProviders là component được tạo chứa các option hỗ trợ đăng nhập
        )}
      </div>
    </nav>
  );
};

export default Navbar;
