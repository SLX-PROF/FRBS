import type { GlobalConfig } from 'payload'
import { adminOnly, staffOnly } from '../lib/access'

// Реквизиты продавца для КП и других документов. Значения — заглушки,
// требуют заполнения реальными данными ООО «Форбса».
export const CompanyProfile: GlobalConfig = {
  slug: 'company-profile',
  label: 'Реквизиты компании',
  admin: { group: 'Система' },
  access: { read: staffOnly, update: adminOnly },
  fields: [
    { name: 'legalName', type: 'text', label: 'Юр. наименование', defaultValue: 'ООО «Форбса»' },
    {
      type: 'row',
      fields: [
        { name: 'inn', type: 'text', label: 'ИНН' },
        { name: 'kpp', type: 'text', label: 'КПП' },
        { name: 'ogrn', type: 'text', label: 'ОГРН' },
      ],
    },
    { name: 'address', type: 'textarea', label: 'Юр. адрес', defaultValue: 'г. Екатеринбург, ул. Производственная, 1' },
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text', label: 'Телефон', defaultValue: '+7 (343) 000-00-00' },
        { name: 'email', type: 'text', label: 'Email', defaultValue: 'info@forbsa.ru' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Банковские реквизиты',
      admin: { initCollapsed: true },
      fields: [
        { name: 'bankName', type: 'text', label: 'Банк' },
        { name: 'account', type: 'text', label: 'Расчётный счёт' },
        { name: 'corrAccount', type: 'text', label: 'Корр. счёт' },
        { name: 'bik', type: 'text', label: 'БИК' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'signerName', type: 'text', label: 'Подписант (ФИО)' },
        { name: 'signerTitle', type: 'text', label: 'Должность подписанта', defaultValue: 'Генеральный директор' },
      ],
    },
  ],
}
