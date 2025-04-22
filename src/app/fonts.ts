import { Montserrat, Bricolage_Grotesque } from 'next/font/google'

export const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '600', '800'],
  variable: '--font-bricolage',
  display: 'swap',
})
