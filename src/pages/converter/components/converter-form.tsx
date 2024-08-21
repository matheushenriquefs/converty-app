import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm, useWatch, type FieldError } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'
import { useQuery } from '@tanstack/react-query'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { buttonVariants } from '@/components/custom/button'
import { Textarea } from '@/components/ui/textarea'
import { GetConversionFileService } from '@/services/get-conversion-file-service'
import { cn } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'
import { GetConversionService } from '@/services/get-conversion-service'

const converterFormSchema = z
  .object({
    sourceUrl: z.string().trim().endsWith('.txt').url(),
    log: z.string().optional(),
    convertedLog: z.string().optional(),
  })
  .required()

type ConverterFormValues = z.infer<typeof converterFormSchema>
type FieldState = {
  invalid: boolean
  isDirty: boolean
  isTouched: boolean
  isValidating: boolean
  error?: FieldError
}

const defaultValues: Partial<ConverterFormValues> = {
  sourceUrl: '',
  log: '',
  convertedLog: '',
}

const getConversionFileService = new GetConversionFileService()

const getLogService = async (url: string, field: FieldState) => {
  if (!field?.isTouched || !field.isDirty) {
    return ''
  }

  if (!url) {
    return ''
  }

  if (field.invalid) {
    return ''
  }

  const response = await fetch(url)

  if (!response.ok) {
    return ''
  }

  return await response.text()
}

const getConversionService = new GetConversionService()

const validateConversionFile = async (
  snapshot: QueryDocumentSnapshot<DocumentData, DocumentData> | null | undefined
) => {
  if (!snapshot) {
    return null
  }

  return await getConversionFileService.handle(snapshot)
}

export default function ConverterForm() {
  const [convertedLog, setConvertedLog] = useState({
    filename: '',
    href: '',
  })
  const form = useForm<ConverterFormValues>({
    resolver: zodResolver(converterFormSchema),
    defaultValues,
    mode: 'onChange',
  })
  const sourceUrlFieldValue = useWatch<ConverterFormValues>({
    name: 'sourceUrl',
    defaultValue: defaultValues.sourceUrl,
    control: form.control,
  })
  const conversionPayload = { sourceUrl: sourceUrlFieldValue }
  const sourceUrlState = form.getFieldState('sourceUrl')

  const { data: log } = useQuery({
    queryKey: ['log', sourceUrlFieldValue, sourceUrlState],
    queryFn: () => getLogService(sourceUrlFieldValue, sourceUrlState),
  })
  const { data: conversion } = useQuery({
    queryKey: ['conversion', sourceUrlFieldValue, conversionPayload],
    queryFn: () =>
      getConversionService.handle(sourceUrlFieldValue, conversionPayload),
  })
  const { data: convertedLogFile } = useQuery({
    queryKey: ['convertedLogFile', conversion],
    queryFn: () => validateConversionFile(conversion),
  })

  useEffect(() => {
    if (!log) {
      return
    }
    toast({
      title: 'Conversão iniciada',
    })
    form.setValue('log', log)
  }, [log, form])

  useEffect(() => {
    if (!convertedLogFile) {
      return
    }

    setTimeout(() => {
      toast({
        title: 'Conversão finalizada',
      })
    }, 1000)
    convertedLogFile.text().then((text) => form.setValue('convertedLog', text))
    setConvertedLog({
      filename: convertedLogFile.name,
      href: URL.createObjectURL(convertedLogFile),
    })
  }, [convertedLogFile, form])

  return (
    <Form {...form}>
      <form className='space-y-8'>
        <FormField
          control={form.control}
          name='sourceUrl'
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Insira um link de um arquivo de log e clique fora do campo de
                texto
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='log'
          disabled
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minha CDN</FormLabel>
              <FormControl>
                <Textarea className='resize-none' {...field} rows={5} />
              </FormControl>
              <FormDescription>
                Você pode visualizar o conteúdo do seu log aqui.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='convertedLog'
          disabled
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agora</FormLabel>
              <FormControl>
                <Textarea className='resize-none' {...field} rows={5} />
              </FormControl>
              <FormDescription>
                Você pode visualizar o conteúdo convertido do seu log aqui.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {convertedLog.href && (
          <a
            className={cn(
              buttonVariants({ variant: 'default', size: 'default' })
            )}
            href={convertedLog.href}
            download={convertedLog.filename}
          >
            Download
          </a>
        )}
      </form>
    </Form>
  )
}
