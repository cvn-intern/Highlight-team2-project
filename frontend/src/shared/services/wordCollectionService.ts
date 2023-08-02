import axiosClient from "../lib/axiosClient";
interface WordCollection {
    id: number
    creator_id: number
    language_code: string
    is_created_by_system: boolean
    theme_name: string
    theme_thumbnail: string
    created_at: Date
    updated_at: Date
}
export default {
    getWordCollections: () => axiosClient.get<Array<WordCollection>>("words-collection?type=0"),
}