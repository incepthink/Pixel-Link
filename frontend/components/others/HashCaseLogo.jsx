import Link from 'next/link'

const HashCaseLogo = () => {
  return (
    <Link href="/">
      {/* Logo */}
      <a className='my-3 md:my-0 flex items-center text-white'>
        {/* <span
                  className={
                    'font-bold text-xl md:text-2xl lg:text-3xl stroke-inherit ' +
                    styles.nft
                  }>
                  Hash
                </span> */}
        <span className='font-bold text-lg md:text-xl lg:text-2xl font-gothom_pro text-white'>
        Pixel Link
        </span>
      </a>
    </Link>
  )
}

export default HashCaseLogo