import { contentApi } from '@/entities/content/api';
import { Bind } from 'fluent-future';
import { useQuery } from '@/shared/lib/compose';

type TopicQuestionsPageVMPropsType = {
    topicID: string
}

export const useTopicEditPageVM = ({topicID}: TopicQuestionsPageVMPropsType) => {

    const {data, error} = useQuery({
        query: () => Bind({
            topic: contentApi.getTopicByID(topicID),
            questions: contentApi.getQuestionsByTopic(topicID)
        }),
        tags: 'editable-topic'
    })


    return {
        data,
        error
    }
}