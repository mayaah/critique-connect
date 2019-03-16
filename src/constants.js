import algoliasearch from 'algoliasearch';

export const DELETED_STRING = "[deleted]"

export const DEFAULT_AVATAR_URL = "https://firebasestorage.googleapis.com/v0/b/critique-connect.appspot.com/o/images%2Fcc-default.jpg?alt=media&token=f77a0196-df38-4a46-8b95-24d611c967cd"

export const GENRES = [
  { label: "Adventure", value: "adventure" },
  { label: "Chick Lit", value: "cl"},
  { label: "Contemporary, Mainstream, & Realistic", value: "cmrf" },
  { label: "Children's", value: "children" },
  { label: "Erotic", value: "erotic" },
  { label: "Fantasy", value: "fantasy" },
  { label: "Historical", value: "historical" },
  { label: "Horror & Supernatural", value: "hs" },
  { label: "LGBT+", value: "lgbt" },
  { label: "Literary", value: "literary" },
  { label: "Memoir & Autobiography", value: "ma" },
  { label: "Middle Grade", value: "mg" },
  { label: "Mystery, Thriller, & Suspense", value: "mts" },
  { label: "New Adult", value: "na" },
  { label: "Other Nonfiction", value: "nonfiction"},
  { label: "Religious, Spiritual, & New Age", value: "rsna" },
  { label: "Romance", value: "romance" },
  { label: "Satire, Humor, & Parody", value: "shp" },
  { label: "Science Fiction", value: "sf" },
  { label: "Women's", value: "wf" },
  { label: "Young Adult", value: "ya" }
];

export const GENRES_HASH = {
  adventure: "Adventure",
  cl: "Chick Lit",
  cmrf: "Contemporary, Mainstream, & Realistic",
  children: "Children's",
  erotic: "Erotic",
  fantasy: "Fantasy",
  historical: "Historical",
  hs: "Horror & Supernatural",
  lgbt: "LGBT+",
  literary: "Literary",
  ma: "Memoir & Autobiography",
  mg: "Middle Grade",
  mts: "Mystery, Thriller, & Suspense",
  na: "New Adult",
  nonfiction: "Other Nonfiction",
  rsna: "Religious, Spiritual, & New Age",
  romance: "Romance",
  shp: "Satire, Humor, & Parody",
  sf: "Science Fiction",
  wf: "Women's",
  ya: "Young Adult"
}

export const TYPES = [
  { label: "Fiction", value: "Fiction" },
  { label: "Nonfiction", value: "Nonfiction"},
  { label: "Novel", value: "Novel"},
  { label: "Novella", value: "Novella"},
  { label: "Poetry", value: "Poetry"},
  { label: "Short Story", value: "Short Story"},
  { label: "Screenplay", value: "Screenplay"},
  { label: "Anthology", value: "Anthology"}
];

export const LANGUAGES = [
  { label: "English", value: "English" },
  { label: "Chinese", value: "Chinese"},
  { label: "German", value: "German" },
  { label: "Spanish", value: "Spanish" },
  { label: "Japanese", value: "Japanese" },
  { label: "Russian", value: "Russian" },
  { label: "French", value: "French" },
  { label: "Korean", value: "Korean" },
  { label: "Italian", value: "Italian" },
  { label: "Dutch", value: "Dutch" },
  { label: "Portuguese", value: "Portuguese" },
  { label: "Hindi", value: "Hindi"},
  { label: "Other", value: "Other"}
];

export const COMPENSATION_TYPES = [
  { label: "Volunteer", value: "Volunteer" },
  { label: "Paid Services", value: "Paid Services"},
  { label: "Critique Exchange", value: "Critique Exchange" },
];

export const TRAITS = [
  { label: "Constructive", value: "Constructive" },
  { label: "Detailed", value: "Detailed" },
  { label: "Encouraging", value: "Encouraging" },
  { label: "Honest", value: "Honest" },
  { label: "Insightful", value: "Insightful" },
  { label: "Kind", value: "Kind" },
  { label: "Respectful", value: "Respectful" },
  { label: "Thorough", value: "Thorough"},
  { label: "Timely", value: "Timely" }
];

export const TRAITS_LIST = [
  "Constructive", 
  "Detailed", 
  "Encouraging", 
  "Honest", 
  "Insightful", 
  "Kind", 
  "Respectful", 
  "Thorough", 
  "Timely"
];

export const algolia = algoliasearch(
  process.env.REACT_APP_ALGOLIA_APP_ID,
  process.env.REACT_APP_ALGOLIA_API_KEY,
  {protocol: 'https:'}
)

export const wipsIndex = algolia.initIndex(process.env.REACT_APP_ALGOLIA_WIPS_INDEX_NAME)

export const usersIndex = algolia.initIndex(process.env.REACT_APP_ALGOLIA_USERS_INDEX_NAME)
