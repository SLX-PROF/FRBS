import * as migration_20260828_093500_sp1_sp2_crm from './20260828_093500_sp1_sp2_crm';
import * as migration_20260828_100000_sp3_tasks from './20260828_100000_sp3_tasks';
import * as migration_20260828_110000_sp4_kp from './20260828_110000_sp4_kp';
import * as migration_20260828_120000_sp5_chat from './20260828_120000_sp5_chat';
import * as migration_20260828_130000_sp5_chat_token from './20260828_130000_sp5_chat_token';
import * as migration_20260917_140000_products_images_gallery from './20260917_140000_products_images_gallery';
import * as migration_20260917_150000_users_role_owner_tier from './20260917_150000_users_role_owner_tier';
import * as migration_20260924_120000_media_image_sizes from './20260924_120000_media_image_sizes';
import * as migration_20260925_133941_cms_pages_drafts from './20260925_133941_cms_pages_drafts';

export const migrations = [
  {
    up: migration_20260828_093500_sp1_sp2_crm.up,
    down: migration_20260828_093500_sp1_sp2_crm.down,
    name: '20260828_093500_sp1_sp2_crm',
  },
  {
    up: migration_20260828_100000_sp3_tasks.up,
    down: migration_20260828_100000_sp3_tasks.down,
    name: '20260828_100000_sp3_tasks',
  },
  {
    up: migration_20260828_110000_sp4_kp.up,
    down: migration_20260828_110000_sp4_kp.down,
    name: '20260828_110000_sp4_kp',
  },
  {
    up: migration_20260828_120000_sp5_chat.up,
    down: migration_20260828_120000_sp5_chat.down,
    name: '20260828_120000_sp5_chat',
  },
  {
    up: migration_20260828_130000_sp5_chat_token.up,
    down: migration_20260828_130000_sp5_chat_token.down,
    name: '20260828_130000_sp5_chat_token',
  },
  {
    up: migration_20260917_140000_products_images_gallery.up,
    down: migration_20260917_140000_products_images_gallery.down,
    name: '20260917_140000_products_images_gallery',
  },
  {
    up: migration_20260917_150000_users_role_owner_tier.up,
    down: migration_20260917_150000_users_role_owner_tier.down,
    name: '20260917_150000_users_role_owner_tier',
  },
  {
    up: migration_20260924_120000_media_image_sizes.up,
    down: migration_20260924_120000_media_image_sizes.down,
    name: '20260924_120000_media_image_sizes',
  },
  {
    up: migration_20260925_133941_cms_pages_drafts.up,
    down: migration_20260925_133941_cms_pages_drafts.down,
    name: '20260925_133941_cms_pages_drafts'
  },
];
