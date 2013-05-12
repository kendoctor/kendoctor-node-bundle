<?php

namespace Kendoctor\Bundle\NodeBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Kendoctor\Bundle\NodeBundle\Entity\Node;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * ContentNOde
 *
 * @ORM\Table()
 * @ORM\Entity
 */
class ContentNode extends Node
{
    /**
     *
     * @var type 
     * @ORM\Column(type="text")
     */
    private $content;   
    
    /**
     *
     * @var type 
     * 
     * @ORM\Column(type="integer")
     */
    private $weight;
    
    /**
     *
     * @var type 
     * @Gedmo\Timestampable(on="update")
     * @ORM\Column(type="datetime")
     */
    private $updatedAt;

    public function __construct()
    {
        //parent::__construct();
        $this->weight = 0;
    }
    
    /**
     * Set content
     *
     * @param string $content
     * @return ContentNode
     */
    public function setContent($content)
    {
        $this->content = $content;
    
        return $this;
    }

    /**
     * Get content
     *
     * @return string 
     */
    public function getContent()
    {
        return $this->content;
    }

  
    /**
     * Set weight
     *
     * @param integer $weight
     * @return ContentNode
     */
    public function setWeight($weight)
    {
        $this->weight = $weight;
    
        return $this;
    }

    /**
     * Get weight
     *
     * @return integer 
     */
    public function getWeight()
    {
        return $this->weight;
    }

    /**
     * Set updatedAt
     *
     * @param \DateTime $updatedAt
     * @return ContentNode
     */
    public function setUpdatedAt($updatedAt)
    {
        $this->updatedAt = $updatedAt;
    
        return $this;
    }

    /**
     * Get updatedAt
     *
     * @return \DateTime 
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt;
    }

  
}