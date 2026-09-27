import { contentApi } from '@/entities/content/api';
import { QueryKeys } from '@/shared/lib/query-keys';
import { Bind } from 'fluent-future';
import { useQuery } from '@/shared/lib/compose';

type TopicQuestionsPageVMPropsType = {
    topicID: string
}

export const useTopicEditPageVM = ({topicID}: TopicQuestionsPageVMPropsType) => {

    const {data, error} = useQuery({
        tags: [
            QueryKeys.topic(topicID),
            QueryKeys.topicQuestions(topicID)
        ],
        query: () => Bind({
            topic: contentApi.getTopicByID(topicID),
            questions: contentApi.getQuestionsByTopic(topicID)
        })
    })


    return {
        data,
        error
    }
}