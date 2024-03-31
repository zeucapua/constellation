import { column, defineTable, defineDb } from 'astro:db';

const User = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    github_id: column.number({ unique: true }),
    username: column.text(),
    starred_url: column.text()
  }
});

const Session = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    expiresAt: column.date(),
    userId: column.text({ references: () => User.columns.id })
  }
});

const Star = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    comment: column.text({ optional: true }),
    user_id: column.text({ references: () => User.columns.id }),
    constellation_id: column.text({ references: () => Constellation.columns.id })
  }
});

const Constellation = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    name: column.text(),
    description: column.text({ optional: true }),
    user_id: column.text({ references: () => User.columns.id })
  }
});

// https://astro.build/db/config
export default defineDb({
  tables: {
    User,
    Session,
    Star,
    Constellation
  }
});
