import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotAllowedError, NotFoundError } from "./errors";

export interface VideoDoc extends BaseDoc {
  author: ObjectId;
  url: string;
  description: string;
}

/**
 * concept: Videos
 */
export default class VideoConcept {
  public readonly videos: DocCollection<VideoDoc>;

  /**
   * Make an instance of an Video.
   */
  constructor(collectionName: string) {
    this.videos = new DocCollection<VideoDoc>(collectionName);
  }

  async createVideo(author: ObjectId, url: string, description: string) {
    const _id = await this.videos.createOne({author, url, description});
    return { msg: "Video created successfully!", organization: await this.videos.readOne({ _id }) };
  }

  async deleteVideo(_id: ObjectId) {
    await this.videos.deleteOne({ _id });
    return { msg: "Video deleted successfully!" };
  }

  async getVideo(_id: ObjectId) {
    return await this.videos.readOne({ _id });
  }

  async getAllVideos() {
    return await this.videos.readMany({}, { sort: { _id: -1 } });
  }

  async assertAuthorIsUser(_id: ObjectId, user: ObjectId) {
    const org = await this.videos.readOne({ _id });
    if (!org) {
      throw new NotFoundError(`Video ${_id} does not exist!`);
    }
    if (org.author.toString() !== user.toString()) {
      throw new VideoAuthorNotMatchError(user, _id);
    }
  }

}

export class VideoAuthorNotMatchError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the author of video {1}!", author, _id);
  }
}
