import * as migration_20260828_093500_sp1_sp2_crm from './20260828_093500_sp1_sp2_crm'
import * as migration_20260828_100000_sp3_tasks from './20260828_100000_sp3_tasks'
import * as migration_20260828_110000_sp4_kp from './20260828_110000_sp4_kp'
import * as migration_20260828_120000_sp5_chat from './20260828_120000_sp5_chat'
import * as migration_20260828_130000_sp5_chat_token from './20260828_130000_sp5_chat_token'

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
]
