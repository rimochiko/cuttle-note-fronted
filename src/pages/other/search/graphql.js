import axios from "axios";

export default {
    searchArticle,
    searchChart,
    searchUser,
    searchGroup,
    search
}

const ARTICLE = "article",
      CHART = "chart",
      GROUP = "group",
      USER = "user";

function search({type, search}) {
    console.log(type, search);
    switch(type) {
        case ARTICLE: 
        return searchArticle({search});

        case CHART: 
        return searchChart({search});

        case GROUP: 
        return searchGroup({search});

        case USER: 
        return searchUser({search});

        default: 
        return searchArticle({search});
      }
}

function searchArticle (args) {
    const query = `query {
        data:
        articleSearch(
            search: "${args.search}"
        ) {
            id
            title
            content
            date
            authorId
            authorName
            avatar
            groupId
            groupName
        }
    }`
    return axios.post('/graphql', {query});
}

function searchChart (args) {
    const query = `query {
        data:
        chartSearch(
            search: "${args.search}"
        ) {
            id
            title
            date
            url
            authorId
            authorName
            avatar
            groupId
            groupName
        }
    }`
    return axios.post('/graphql', {query});
}

function searchGroup (args) {
    const query = `query {
        data:
        groupSearch(
            search: "${args.search}"
        ) {
            id
            nickname
            avatar
            adminId
            adminAvatar
            adminName
        }
    }`
    return axios.post('/graphql', {query});
}

function searchUser (args) {
    const query = `query {
        data:
        userSearch(
            search: "${args.search}"
        ) {
            id
            nickname
            avatar
        }
    }`
    return axios.post('/graphql', {query});
}
