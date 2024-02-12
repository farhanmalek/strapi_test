// path: ./config/cron-tasks.js


module.exports = {
    /**
     * Scheduled publication workflow.
     * Checks every minute if there are draft articles to publish.
     */
  
    '*/1 * * * *': async () => {
      // fetch articles to publish;
      const draftArticleToPublish = await strapi.entityService.findMany('api::blog.blog', {
        publicationState: 'preview', // preview returns both draft and published entries
        filters: {
          publishedAt: {
            $null: true, // so we add another condition here to filter entries that have not been published
          },
          publish_at: {
            $lt: new Date() // and we keep only articles with a 'publish_at' datetime value that is lower than the current datetime
          }
        }
      });
      // update the publish_at of articles previously fetched
      await Promise.all(draftArticleToPublish.map(blog => {
        return strapi.entityService.update('api::blog.blog', blog.id, {
          data: {
            publishedAt: new Date(),
          }
        });
      }))
    },
  };


