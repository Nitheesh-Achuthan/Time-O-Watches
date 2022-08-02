adminrouter.patch("/:id", async (req, res) => {
  
  

    try {
      const user = await User.findOne({ _id: req.params.id });
      
      if (user.isBlocked) {
        await User.updateOne({ _id: req.params.id }, { isBlocked: false }).then(
          (message) => {
            res.status(200).json("false");
          }
        );
      } else {
        await User.updateOne({ _id: req.params.id }, { isBlocked: true }).then(
          (message) => {
            res.status(200).json("true");
          }
        );
      }
    } catch (error) {
      res.status(400).json(error);
    }
  });