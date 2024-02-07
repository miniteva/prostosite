import React from "react";
import { useParams } from "react-router-dom";
import axios from '../axios'

import { Menu } from "../components/Menu";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";

import {darkTheme, theme} from "../../src/theme";

export const FullMenu = () => {
    const [data, setData] = React.useState();
    const [isLoading, setLoading] = React.useState(true);

    const {id} = useParams();

    React.useEffect(() => {
        axios
            .get(`/menu/${id}`)
            .then((res) => {
                setData(res.data);
                setLoading(false);
                console.log('DATA!!!!!!!!', res.data)
            })
            .catch((err) => {
                console.warn(err);
                alert('Ошибка при получении меню');
            })
    }, []);

    if(isLoading || !data) {
        return <Menu isLoading={isLoading} isFullMenu />;
    }

  return (
      <div
          style={{
              background: darkTheme.palette.background.default,
              minHeight: "100vh",
              justifyContent: "center",
              alignItems: "center"
          }}
      >
        <Menu
            id={data._id}
            day={`${data.day}`}
            option={data.option}
            // imageUrl="https://res.cloudinary.com/practicaldev/image/fetch/s--UnAfrEG8--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/icohm5g0axh9wjmu4oc3.png"
            user={
                data.user
            }
            createdAt={new Date(data.createdAt).toLocaleDateString('ru-RU')}
            dishes={([...data.dishes])}
            // viewsCount={150}
            // commentsCount={3}
            // tags={['react', 'fun', 'typescript']}
            isEditable
        />
      <CommentsBlock
        items={[
          {
            user: {
              fullName: "Иван Иванов",
              avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
            },
            text: "ТЕСТ",
          },
          {
            user: {
              fullName: "Александр Емельяненко",
              avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
            },
            text: "Могли бы и лучше",
          },
            {
                user: {
                    fullName: "Иван Емельяненко",
                    avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
                },
                text: "Хочу бургер!",
            },
        ]}
        isLoading={false}
      >
        <Index />
      </CommentsBlock>
    </div>


  );
};
