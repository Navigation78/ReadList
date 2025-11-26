const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: __dirname + '/../../server/.env' })

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRole) {
  console.warn('Supabase server client not fully configured: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in server/.env')
}

const supabase = createClient(supabaseUrl, supabaseServiceRole)

module.exports = supabase
