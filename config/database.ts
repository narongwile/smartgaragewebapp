/**
 * Config source: https://git.io/JesV9
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import Env from '@ioc:Adonis/Core/Env'
import { DatabaseConfig } from '@ioc:Adonis/Lucid/Database'

const databaseConfig: DatabaseConfig = {
  /*
  |--------------------------------------------------------------------------
  | Connection
  |--------------------------------------------------------------------------
  |
  | The primary connection for making database queries across the application
  | You can use any key from the `connections` object defined in this same
  | file.
  |
  */
  connection: Env.get('DB_CONNECTION'),

  connections: {
    /*
    |--------------------------------------------------------------------------
    | MSSQL config
    |--------------------------------------------------------------------------
    |
    | Configuration for MSSQL database. Make sure to install the driver
    | from npm when using this connection
    |
    | npm i tedious
    |
    */
    mssql: {
      client: 'mssql',
      connection: {
        user: Env.get('MSSQL_USER', 'nrkwine'),
        port: Env.get('1433'),
        server: Env.get('MSSQL_SERVER', 'smartgaragedbserver.database.windows.net'),
        password: Env.get('MSSQL_PASSWORD', 'NRK@wine2544'),
        database: Env.get('MSSQL_DB_NAME', 'smartgaragedb'),
        options: {
          encrypt: Env.get('DB_ENCRYPT', true)   // use this for Azure database encryption
        },
      },
      migrations: {
        naturalSort: true,
      },
      healthCheck: false,
      debug: false,
    }
  }
}

export default databaseConfig
