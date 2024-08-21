import { Layout } from '@/components/custom/layout'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import ConverterForm from '@/pages/converter/components/converter-form'

export default function Converter() {
  return (
    <Layout>
      <Layout.Header sticky>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      <Layout.Body>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Bem-vindo de volta!
            </h2>
            <p className='text-muted-foreground'>
              Converta logs do formato Minha CDN para Agora de forma simples
            </p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <ConverterForm />
        </div>
      </Layout.Body>
    </Layout>
  )
}
